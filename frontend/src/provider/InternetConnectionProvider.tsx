import { useEffect, useRef, useState } from "react";
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
  const [isOnline, setIsOnline] = useState(true);

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
      setIsOnline(true);
      dispatch(setIsConnected(true));
      close();
    };

    const handleOffline = () => {
      setIsOnline(false);
      dispatch(setIsConnected(false));
      addToast();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check status on initial mount
    if (!isOnline) {
      setIsOnline(false);
      addToast();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return children;
};

export default InternetConnectionProvider;
