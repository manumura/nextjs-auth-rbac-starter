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
    console.error(err);
    return { props: { user: {} } };
  }
}

const EditProfile = ({ user }) => {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <section className="min-h-screen bg-primary">
      <div className="flex flex-col items-center py-20">
        <div
          className="card m-5 w-3/4 max-w-screen-lg bg-secondary shadow-xl"
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
