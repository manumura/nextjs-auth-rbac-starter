"use client";

import { useRouter } from "next/navigation";

export default function ProfilePage({ user }) {
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
}
