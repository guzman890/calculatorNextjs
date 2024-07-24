"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const user = {
    username: formData.get("email") ?? "-",
    password: formData.get("password") ?? "-"
  };

  console.log("init responseLogin")
  console.log("user", JSON.stringify(user))
  try {
      const response = await fetch("http://3.15.196.64/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    var authorizationToken = response.headers.get("authorization");
      
    var data = await response.json();
    console.log("data", data)

    const session = {  'user': data};
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
    });

    const token = { 'token': authorizationToken };
    cookies().set("token", JSON.stringify(token) , {
      httpOnly: true,
    });

  } catch (error) {
    console.error("Failed to fetch login:", error);
    redirect("/login");
  }

}

export async function logoutAction() {
  console.log("logoutAction");
  // cookies().set("session", "", { expires: new Date(0) });
  // document.cookie = 'session=; Max-Age=0'
  cookies().delete('session')
  cookies().delete('token')
  redirect("/");
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return JSON.parse(session);
}

export const loginAction = async (formData: FormData) => {
  await login(formData);
  redirect("/operations");
}

export async function goRecord() {
  redirect("/record");
}