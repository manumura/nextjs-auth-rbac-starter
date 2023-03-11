const Users = () => {
  const users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const cards = users.map((user) => (
    <>
    <div className="card m-5 w-3/4 max-w-screen-lg shadow-xl bg-secondary" key={user}>
      <div className="card-body">
        <h2 className="card-title">Card title!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn">Buy Now</button>
        </div>
      </div>
    </div>
    <div className="card m-5 w-3/4 max-w-screen-lg shadow-xl min-w bg-secondary" key={user}>
    <div className="card-body">
      <h2 className="card-title">Card title!</h2>
      <p>If a dog chews shoes whose shoes does he choose?If a dog chews shoes whose shoes does he choose?</p>
      <div className="card-actions justify-end">
        <button className="btn">Buy Now</button>
      </div>
    </div>
  </div>
  </>
  ));

  return (
    <section className="min-h-max bg-primary">
      <div className="flex flex-col justify-center items-center">{cards}</div>
    </section>
  );
};

export default Users;
