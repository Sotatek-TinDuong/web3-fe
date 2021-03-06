import "./index.scss";

export const Footer = (props) => {
  return (
    <div className="footer">
    {/* <div className="footer"> */}
      <div className="wrapper">
        <div className="container">
          <div className="content">
            <div className="fo fo-left">
              <ul>
                <li>
                  <a
                    href="https://etherscan.io"
                    target="_blank"
                  >
                    Contract
                  </a>
                </li>
                <li>
                  <a
                    href="https://opensea.io"
                    target="_blank"
                  >
                    Opensea
                  </a>
                </li>
              </ul>
            </div>
            <div className="fo fo-right">
              <ul>
                <li>
                  <a href="https://twitter.com" target="_blank">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg" target="_blank">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
