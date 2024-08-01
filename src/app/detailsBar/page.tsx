import { logoutAction } from "@/app/lib/actions";
import BackClient from "@/components/backClient";
import { cookies } from "next/headers";


const DetailsBar = async () => {
  const session = JSON.parse(cookies().get("session")?.value|| "{}")?.user;

  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto h-full">
          <div className="flex justify-end items-center h-full px-4">
            <ul className="flex gap-x-6">
              <li>
                <BackClient />
              </li>
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
