export function SocialLoginButtons() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div
            className="w-full border-t"
            style={{ borderColor: "#DCDEDD" }}
          ></div>
        </div>
        <div className="relative flex justify-center text-sm"></div>
      </div>

      <div className="text-center">
        <p className="text-brand-light text-sm font-normal">
          Don't have an account?{" "}
          <a
            href="signup"
            className="text-blue-500 text-sm font-semibold hover:brightness-110 transition-all duration-300"
          >
            Sign up here
          </a>
        </p>
      </div>
    </>
  );
}
