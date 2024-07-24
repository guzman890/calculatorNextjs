import { logoutAction } from "@/app/lib/actions";
import { cookies } from "next/headers";

type SessionType = {
  user: {
    email: string;
  };
};

const DetailsBar = async () => {
  const session = JSON.parse(cookies().get("session")?.value|| "{}")?.user;

  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full ">
          <div className="flex justify-end items-center h-full">
            <ul className="hidden md:flex gap-x-6 text-white ">
              <li>
                <p>{session.username}</p>
              </li>
              <li>
                <p>Credits: {session.credits}</p>
              </li>
              <li>
                <form action={logoutAction}>
                  <button className="bg-emerald-700 rounded px-2">Logout</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsBar;
