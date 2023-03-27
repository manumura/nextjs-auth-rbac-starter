import { axiosInstance } from "@/lib/api";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getAuthCookies } from "../lib/cookies";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const authCookies = getAuthCookies(req, res);
    const response = await axiosInstance.get("/v1/profile", {
      headers: {
        Cookie: authCookies,
      },
    });

    // Set new cookies in case tokens are expired (set from axios interceptor)
    const setCookieHeader = response.config?.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    const data = response.data;
    return { props: { user: data } };
  } catch (err) {
    console.error("Profile getServerSideProps error: ", err.response?.data);
    // Set new cookies in case tokens are expired (set from axios interceptor)
    const setCookieHeader = err.response?.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    return {
      redirect: {
        permanent: false,
        destination: `/error?code=${err.response?.data?.statusCode}`,
      },
      props: {},
    };
  }
};

const Profile = ({ user }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/edit-profile");
  };

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      <div className="flex flex-col items-center py-20">
        <div className="card m-5 w-3/4 max-w-screen-lg bg-slate-50 shadow-xl">
          <div className="card-body">
            <div className="card-title">
              <h1>My Profile</h1>
            </div>
            <div className="grid auto-cols-auto grid-cols-5 gap-4">
              <div className="text-right">
                <h2>Full Name:</h2>
              </div>
              <div className="col-span-4">
                <h2>{user.name}</h2>
              </div>
              <div className="text-right">Email:</div>
              <div className="col-span-4">{user.email}</div>
              <div className="text-right">
                <h3>Role:</h3>
              </div>
              <div className="col-span-4">
                <h3>{user.role}</h3>
              </div>
            </div>
            <div className="card-actions justify-end">
              <button className="btn" onClick={handleEdit}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
