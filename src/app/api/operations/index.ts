"use server";

import { stat } from "fs";
import { cookies } from "next/headers";

export default async function getTime(
  firstValue: any,
  secondValue: any,
  id: any
) {
  try {
    const response = await fetch(
      "https://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires",
      {
        next: {
          revalidate: 3,
        },
      }
    );
    const data = await response.json();

    console.log(
      "firstValue ->",firstValue,
      "secondValue ->",secondValue,
      "id ->",id
    );
    console.log(data.datetime);

    return data.datetime;
  } catch (error) {
    console.error("Failed to fetch random string:", error);
  }
}

export async function getOperations() {
  try {
    const session = JSON.parse(cookies().get("session")?.value|| "");
    const token = JSON.parse(cookies().get("token")?.value || "");
    console.log("getOperations: user ->", session.user);
    console.log("getOperations: token ->", token.token);

    const response = await fetch("http://3.15.196.64/operations", {
      headers: {
        Authorization:
          "Bearer "+ token.token,
      },
    });
    const data = await response.json();
    console.log("Data getOperations->", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch operations:", error);
  }
}

export async function getRecords( page: number, rowsPerPage: number) {
  try {
    console.log("page ->", page);
    console.log("rowsPerPage ->", rowsPerPage);
    const session = JSON.parse(cookies().get("session")?.value|| "");
    const token = JSON.parse(cookies().get("token")?.value || "");
    console.log("getOperations: user ->", session.user);
    console.log("getOperations: token ->", token.token);
    
    const response = await fetch("http://3.15.196.64/records/page?page="+(page-1)+"&size="+rowsPerPage+"&sort=date,desc", {
      headers: {
        Authorization:
          "Bearer "+ token.token,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch records:", error);
  }
}


export async function getOperationResult(
  firstValue: number,
  secondValue: number,
  id: any
) {
  try {

    const session = JSON.parse(cookies().get("session")?.value|| "");
    const token = JSON.parse(cookies().get("token")?.value || "");
    console.log("getOperations: user ->", session.user);
    console.log("getOperations: token ->", token.token);

    console.log("firstValue ->", firstValue, "secondValue ->", secondValue, "id ->", id);
    console.log(JSON.stringify({'operationId': id, 'userId': session.user.id, value:[firstValue, secondValue]}))
    const response = await fetch("http://3.15.196.64/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer "+ token.token,
      },
      body: JSON.stringify({'operationId': id, 'userId': session.user.id, value:[firstValue, secondValue]}),
    });

    if (response.status === 400) {
      const erroData = await response.text();
      return { operationResponse: erroData, status: response.status };
    }

    const data = await response.json();

    const responseUser = await fetch("http://3.15.196.64/users/"+session.user.id, {
      headers: {
        Authorization:
          "Bearer "+ token.token,
      },
    });
    const currentUser = await responseUser.json();
    const newSession = {  'user': currentUser };

    cookies().set("session", JSON.stringify(newSession), {
      httpOnly: true,
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch result of operations:", error);
  }
}
