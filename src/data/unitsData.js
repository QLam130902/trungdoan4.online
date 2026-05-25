// Dữ liệu cấu trúc cây đơn vị của Trung đoàn 4
export const unitsHierarchy = [
  {
    code: "TRUNG_DOAN_4",
    name: "Trung đoàn Bộ binh 4",
    type: "REGIMENT",
    children: [
      {
        code: "TD1",
        name: "Tiểu đoàn 1",
        type: "BATTALION",
        children: [
          { code: "c1", name: "Đại đội 1", type: "COMPANY" },
          { code: "c2", name: "Đại đội 2", type: "COMPANY" },
          { code: "c3", name: "Đại đội 3", type: "COMPANY" },
          { code: "c4", name: "Đại đội 4", type: "COMPANY" },
          { code: "KTT_TD1", name: "Khối trực thuộc tiểu đoàn 1", type: "OTHER" }
        ]
      },
      {
        code: "TD2",
        name: "Tiểu đoàn 2",
        type: "BATTALION",
        children: [
          { code: "c5", name: "Đại đội 5", type: "COMPANY" },
          { code: "c6", name: "Đại đội 6", type: "COMPANY" },
          { code: "c7", name: "Đại đội 7", type: "COMPANY" },
          { code: "c8", name: "Đại đội 8", type: "COMPANY" },
          { code: "KTT_TD2", name: "Khối trực thuộc tiểu đoàn 2", type: "OTHER" }
        ]
      },
      {
        code: "TD3",
        name: "Tiểu đoàn 3",
        type: "BATTALION",
        children: [
          { code: "c9", name: "Đại đội 9", type: "COMPANY" },
          { code: "c10", name: "Đại đội 10", type: "COMPANY" },
          { code: "c11", name: "Đại đội 11", type: "COMPANY" },
          { code: "c12", name: "Đại đội 12", type: "COMPANY" },
          { code: "KTT_TD3", name: "Khối trực thuộc tiểu đoàn 3", type: "OTHER" }
        ]
      },
      {
        code: "DIRECT_COMPANIES",
        name: "Đại đội trực thuộc Trung đoàn",
        type: "GROUP",
        children: [
          { code: "c14", name: "Đại đội 14 trực thuộc", type: "COMPANY" },
          { code: "c15", name: "Đại đội 15 trực thuộc", type: "COMPANY" },
          { code: "c16", name: "Đại đội 16 trực thuộc", type: "COMPANY" },
          { code: "c17", name: "Đại đội 17 trực thuộc", type: "COMPANY" },
          { code: "c18", name: "Đại đội 18 trực thuộc", type: "COMPANY" },
          { code: "c20", name: "Đại đội 20 trực thuộc", type: "COMPANY" },
          { code: "c24", name: "Đại đội 24 trực thuộc", type: "COMPANY" },
          { code: "c25", name: "Đại đội 25 trực thuộc", type: "COMPANY" }
        ]
      }
    ]
  }
];

// Trả về danh sách phẳng tất cả đơn vị để tra cứu nhanh tên
export const getUnitName = (code) => {
  if (code === "TRUNG_DOAN_4") return "Trung đoàn Bộ binh 4";
  for (const reg of unitsHierarchy) {
    for (const child of reg.children) {
      if (child.code === code) return child.name;
      if (child.children) {
        for (const sub of child.children) {
          if (sub.code === code) return sub.name;
        }
      }
    }
  }
  return code || "Không xác định";
};
