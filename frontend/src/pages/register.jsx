import LeftPanel from "../components/LeftPanel";

import RegisterForm from "../components/RegisterForm";

const Register = () => {
  return (
    <main className="min-h-screen lg:flex">
      <LeftPanel />
      <RegisterForm />
    </main>
  );
};

export default Register;