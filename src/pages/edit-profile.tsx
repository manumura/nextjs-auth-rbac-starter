import { axiosInstance } from "@/lib/api";
import { useRouter } from "next/router";

export async function getServerSideProps({ req, res }) {
  try {
    const response = await axiosInstance.get("/v1/profile", {
      headers: {
        Cookie: req.headers.cookie,
      },
    });

    // Set new cookies in case tokens are expired (set from axios interceptor)
    const setCookieHeader = response.config?.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    const data = response.data;
    return { props: { user: data } };
  } catch (err) {
    console.error('Edit Profile getServerSideProps error: ', err.response?.data);
    // Set new cookies in case tokens are expired (set from axios interceptor)
    const setCookieHeader = err.response?.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }
    
    return {
      redirect: {
        permanent: false,
        destination: `/login?error=${err.response?.data?.statusCode}`,
      },
      props: {},
    };
  }
}

const EditProfile = ({ user }) => {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      <div className="flex flex-col items-center py-20">
        <div
          className="card m-5 w-3/4 max-w-screen-lg bg-slate-50 shadow-xl"
          key={user.id}
        >
          <div className="card-body">
            <h2 className="card-title">{user.name}</h2>
            <p>{user.email}</p>
            <h3>{user.role}</h3>
            <div className="card-actions justify-end">
              <div>
                <button className="btn-outline btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
              <div>
                <button className="btn">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
