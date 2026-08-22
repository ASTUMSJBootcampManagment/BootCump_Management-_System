import LeftPanel from "../components/LeftPanel";

import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <main className="min-h-screen lg:flex">
      <LeftPanel />
      <LoginForm />
    </main>
  );
};

export default Login;