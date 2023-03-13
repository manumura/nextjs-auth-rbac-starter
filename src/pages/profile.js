import { axiosInstance } from "@/lib/api";
import { useRouter } from "next/router";

export async function getServerSideProps({ req }) {
  try {
    const res = await axiosInstance.get("/v1/profile", {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    const data = await res.data;
    return { props: { user: data } };
  } catch (err) {
    console.log(err.response.data);
    // return { props: { user: {}, error: err?.response?.data } };
    return {
      redirect: {
        permanent: false,
        destination: `/login?error=${err?.response?.data?.statusCode}`,
      },
      props: {},
    };
  }
}

const Profile = ({ user }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/edit-profile");
  };

  return (
    <section className="min-h-screen bg-slate-200">
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
