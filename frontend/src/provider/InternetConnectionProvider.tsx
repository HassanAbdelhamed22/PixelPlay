import { useEffect, useState } from "react";

const InternetConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
  }, []);

  window.addEventListener("online", () => {
    console.log("Online");
  });

  window.addEventListener("offline", () => {
    console.log("Offline");
  });

  if (!isOnline) {
    return <>{children}</>;
  }
  return { children };
};

export default InternetConnectionProvider;
