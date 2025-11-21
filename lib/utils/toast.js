import toast from "react-hot-toast";

export const showToast = (message, type = "default") => {
  const baseStyle = {
    background: "#333",
    color: "#fff",
  };

  switch (type) {
    case "success":
      return toast.success(message, { style: baseStyle });
    case "error":
      return toast(message, { style: baseStyle });
    case "loading":
      return toast.loading(message, { style: baseStyle });
    default:
      return toast(message, { style: baseStyle });
  }
};
