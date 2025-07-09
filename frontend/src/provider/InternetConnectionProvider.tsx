import { useEffect, useRef } from "react";
import { toaster } from "../components/ui/toaster";
import { useDispatch } from "react-redux";
import { setIsConnected } from "../app/features/networkSlice";

const InternetConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const toastIdRef = useRef<string | null>(null);

  function close() {
    toaster.dismiss(toastIdRef.current || "");
  }

  function addToast() {
    toastIdRef.current = toaster.create({
      title: "No Internet Connection",
      description: "You are currently offline. Please check your connection.",
      type: "warning",
      duration: Infinity,
      closable: true,
    });
  }

  useEffect(() => {
    const handleOnline = () => {
      dispatch(setIsConnected(true));
      close();
    };

    const handleOffline = () => {
      dispatch(setIsConnected(false));
      addToast();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return children;
};

export default InternetConnectionProvider;
