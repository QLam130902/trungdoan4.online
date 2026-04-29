import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Modal';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // States for new user form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rank, setRank] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('ROLE_OFFICER');

  const { user: currentUser, getAuthHeaders } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Không thể tải danh sách cán bộ');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username, password, fullName, rank, position, role
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
      
      // Refresh list and clear form
      fetchUsers();
      setUsername(''); setPassword(''); setFullName('');
      setRank(''); setPosition(''); setRole('ROLE_OFFICER');
      setIsCreateModalOpen(false); // Đóng modal sau khi tạo thành công
    } catch (err) {
      alert('Lỗi tạo tài khoản: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (currentUser && id === currentUser.id) {
      alert('Bạn không thể tự xóa tài khoản của chính mình!');
      return;
    }
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    try {
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Xóa thất bại');
      setUsers(users.filter(u => u.id !== id));
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser(null);
      }
    } catch (err) {
      alert('Lỗi xóa tài khoản: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'var(--red-600)' }}>Quản lý Cán bộ</h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          style={{ 
            backgroundColor: 'var(--success)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            fontSize: '24px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
          title="Thêm tài khoản mới"
        >
          +
        </button>
      </div>

      <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <h2 style={{ marginBottom: "15px", color: "var(--red-600)" }}>Thêm tài khoản mới</h2>
        <form onSubmit={handleCreateUser} className="user-form-grid" style={{ textAlign: 'left' }}>
          <div className="field">
            <label className="label">Tên đăng nhập</label>
            <input type="text" placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} required className="input" />
          </div>
          <div className="field">
            <label className="label">Mật khẩu</label>
            <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required className="input" />
          </div>
          <div className="field">
            <label className="label">Họ và tên</label>
            <input type="text" placeholder="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} required className="input" />
          </div>
          <div className="field">
            <label className="label">Cấp bậc</label>
            <input type="text" placeholder="VD: Thiếu tá" value={rank} onChange={e => setRank(e.target.value)} required className="input" />
          </div>
          <div className="field">
            <label className="label">Chức vụ</label>
            <input type="text" placeholder="VD: Tiểu đoàn trưởng" value={position} onChange={e => setPosition(e.target.value)} required className="input" />
          </div>
          <div className="field">
            <label className="label">Quyền hạn</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="input">
              <option value="ROLE_OFFICER">Cán bộ xử lý (Officer)</option>
              <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1 }}>Hủy</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>Tạo tài khoản</button>
          </div>
        </form>
      </Modal>

      {/* Danh sách */}
      <div className="card">
        {isLoading ? <p>Đang tải...</p> : error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--gold-100)', textAlign: 'left' }}>
                  <th style={thStyle}>Tài khoản</th>
                  <th style={thStyle}>Họ và tên</th>
                  <th className="hide-on-mobile" style={thStyle}>Cấp bậc / Chức vụ</th>
                  <th className="hide-on-mobile" style={thStyle}>Quyền</th>
                  <th className="hide-on-mobile" style={thStyle}>Thao tác</th>
                  <th className="show-on-mobile" style={thStyle}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}><strong>{u.username}</strong></td>
                    <td style={tdStyle}>{u.fullName}</td>
                    <td className="hide-on-mobile" style={tdStyle}>{u.rank} - {u.position}</td>
                    <td className="hide-on-mobile" style={tdStyle}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: u.role === 'ROLE_ADMIN' ? 'var(--red-100)' : 'var(--sky-100)',
                        color: u.role === 'ROLE_ADMIN' ? 'var(--red-600)' : 'var(--sky-600)'
                      }}>
                        {u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'OFFICER'}
                      </span>
                    </td>
                    <td className="hide-on-mobile" style={tdStyle}>
                      <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '6px 12px', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Xóa
                      </button>
                    </td>
                    <td className="show-on-mobile" style={tdStyle}>
                      <button onClick={() => setSelectedUser(u)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        👀 Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <h2 style={{ marginBottom: "15px", color: "var(--red-600)"}}>Chi tiết cán bộ</h2>
        {selectedUser && (
          <div style={{ textAlign: "left", fontSize: "14px", lineHeight: "1.6" }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div><strong>Tài khoản:</strong> {selectedUser.username}</div>
              <div><strong>Họ và tên:</strong> {selectedUser.fullName}</div>
              <div><strong>Cấp bậc:</strong> {selectedUser.rank}</div>
              <div><strong>Chức vụ:</strong> {selectedUser.position}</div>
              <div>
                <strong>Quyền: </strong> 
                <span style={{ 
                  padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                  backgroundColor: selectedUser.role === 'ROLE_ADMIN' ? 'var(--red-100)' : 'var(--sky-100)',
                  color: selectedUser.role === 'ROLE_ADMIN' ? 'var(--red-600)' : 'var(--sky-600)'
                }}>
                  {selectedUser.role === 'ROLE_ADMIN' ? 'ADMIN' : 'OFFICER'}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
              <button 
                onClick={() => handleDeleteUser(selectedUser.id)}
                title="Xóa Tài Khoản"
                style={{ 
                  padding: "10px 16px", backgroundColor: "var(--danger)", color: "white", 
                  border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: "bold"
                }}
              >
                🗑️ Xóa
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={() => setSelectedUser(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const thStyle = { padding: '12px', borderBottom: '2px solid var(--gold-300)', color: 'var(--gray-700)' };
const tdStyle = { padding: '12px', color: 'var(--gray-800)' };

export default UserManagementPage;
