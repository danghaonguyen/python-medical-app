 // Style tuỳ chỉnh cho react-select dùng ở bộ lọc lịch sử.
// Tách riêng để không tạo object mới mỗi lần component re-render.
export const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#287b83" : "#d5e0e8",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(40, 123, 131, 0.12)"
      : "none",
    fontSize: "14px",
    fontWeight: 500,
    minHeight: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: state.isDisabled ? "#f1f5f8" : "#ffffff",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
    "&:hover": {
      borderColor: state.isFocused ? "#287b83" : "#a9c5ce",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    minWidth: 0,
    padding: "0 11px",
  }),

  placeholder: (base) => ({
    ...base,
    margin: 0,
    color: "#8495a7",
    fontSize: "14px",
    fontWeight: 400,
  }),

  singleValue: (base) => ({
    ...base,
    color: "#34475a",
    fontSize: "14px",
    fontWeight: 500,
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "#34475a",
    fontSize: "14px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: "7px",
    color: "#71869a",
    "&:hover": {
      color: "#287b83",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    padding: "7px",
    color: "#71869a",
    "&:hover": {
      color: "#b83232",
    },
  }),

  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#e2e8ef",
  }),

  menu: (base) => ({
    ...base,
    zIndex: 30,
    marginTop: "6px",
    overflow: "hidden",
    border: "1px solid #e2e8ef",
    borderRadius: "9px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 24px rgba(24, 59, 86, 0.12)",
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: "240px",
    padding: "5px",
  }),

  option: (base, state) => ({
    ...base,
    padding: "9px 11px",
    borderRadius: "5px",
    backgroundColor: state.isSelected
      ? "#287b83"
      : state.isFocused
        ? "#edf6f7"
        : "#ffffff",
    color: state.isSelected
      ? "#ffffff"
      : state.isFocused
        ? "#205b65"
        : "#34475a",
    fontSize: "14px",
    lineHeight: 1.5,
    cursor: "pointer",
    "&:active": {
      backgroundColor: state.isSelected ? "#20666d" : "#dceff1",
    },
  }),
};