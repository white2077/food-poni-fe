import "./LoadingPage.scss";

export function LoadingPage() {
  return (
    <div className="smart-glass">
      <h1></h1>
      <div className="logo">
        <div className="circle">
          <div className="circle">
            <div className="circle"></div>
          </div>
        </div>
        <div className="hold-x">
          <img src="/logo-02.png" className="imgLogo"></img>
        </div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
}
