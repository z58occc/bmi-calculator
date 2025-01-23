import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import BMICLogo from "./img/BMICLogo.png";
import BlackLogo from "./img/BMICLogoBlack.png";
import "firebase/compat/database";
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import loop from "./img/icons_loop.png";

function App() {
  const [counting, setCounting] = useState(false);
  const [BMI, setBMI] = useState("");
  const sumitRef = useRef(null);
  const [oldData, setOldData] = useState([]);
  const resultRef = useRef(null);

  const [newData, setNewData] = useState({
    BMI: "",
    weight: "",
    height: "",
    date: `${new Date().getMonth() < 10 ? "0" : ""}${
      new Date().getMonth() + 1
    }-${new Date().getDate()}-${new Date().getFullYear()}`,
  });

  const firebaseConfig = {
    apiKey: "AIzaSyCU-etIxPTD1Z_L-2xLSXdlgzf_t-byArQ",
    authDomain: "project-fdd3b.firebaseapp.com",
    databaseURL: "https://project-fdd3b-default-rtdb.firebaseio.com",
    projectId: "project-fdd3b",
    storageBucket: "project-fdd3b.firebasestorage.app",
    messagingSenderId: "504459853023",
    appId: "1:504459853023:web:2c570972f27113f34bfd6a",
    measurementId: "G-5G2FVR5BD4",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getDatabase(app);
  function updateData(e) {
    const { value, name } = e.target;
    setNewData({
      ...newData,
      [name]: value,
    });
  }
  function calculate() {
    const { weight, height } = newData;
    if (!weight || !height) {
      alert("兩者不得為空");
      return;
    }
    sumitRef.current.style.background = " #DEA821";

    const BMI =
      Number(weight) / (((Number(height) / 100) * Number(height)) / 100);
    setBMI(BMI.toFixed(2));
    setInterval(() => {
      sumitRef.current.style.display = "none";
      resultRef.current.style.display = "flex";
      setCounting(true);
    }, 1000);

    const myData = {
      ...newData,
      BMI: BMI.toFixed(2),
    };
    setNewData(myData);
    push(ref(db, "BMI/"), {
      ...newData,
      BMI: BMI.toFixed(2),
    });
  }
  useEffect(() => {
    const BMIRef = ref(db, "BMI/");
    onValue(BMIRef, (snapshot) => {
      let arr = [];
      const data = snapshot.val();
      for (const key in data) {
        arr.push(data[key]);
      }
      setOldData(arr);
    });
  }, []);
  const getColor = (BMI) => {
    if (BMI <= 18.5) {
      return {
        color: "#31BAF9",
        word: "過輕",
      };
    } else if (18.5 <= BMI && BMI < 24) {
      return {
        color: "#86D73F",
        word: "理想",
      };
    } else if (24 <= BMI && BMI < 27) {
      return {
        color: "#FF982D",
        word: "過重",
      };
    } else if (27 <= BMI && BMI < 30) {
      return {
        color: "#FF6C03",
        word: "輕度肥胖",
      };
    } else if (30 <= BMI && BMI < 35) {
      return {
        color: "#FF6C03",
        word: "中度肥胖",
      };
    } else if (BMI >= 35) {
      return {
        color: "#FF1200",
        word: "重度肥胖",
      };
    }
  };

  return (
    <div
      className=""
      style={{
        background: "#f5f5f5",
      }}
    >
      <div
        className="top d-flex justify-content-center align-items-center"
        style={{
          background: "#424242 ",
          height: "300px",
        }}
      >
        <img src={BMICLogo} alt="" />
        <div
          style={{
            marginLeft: "97px",
          }}
        >
          <div
            style={{
              fontFamily: " .AppleSystemUIFont",
              fontSize: "18px",
              color: "#FFD366",
              width: "66px",
              height: "18px",
            }}
          >
            身高 cm
          </div>
          <input
            type="number"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "2px solid #FFD366",
              borderRadius: "10px",
              width: "250px",
              marginTop: "7px",
            }}
            placeholder="請輸入身高"
            name="height"
            onChange={(e) => updateData(e)}
          />
          <div
            style={{
              fontFamily: " .AppleSystemUIFont",
              fontSize: "18px",
              color: "#FFD366",
              width: "66px",
              height: "18px",
              marginTop: "31px",
            }}
          >
            體重 kg
          </div>
          <input
            type="number"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "2px solid #FFD366",
              borderRadius: "10px",
              width: "250px",
              marginTop: "7px",
            }}
            name="weight"
            placeholder="請輸入體重"
            onChange={(e) => updateData(e)}
          />
        </div>
        <div
          className="sumit  justify-content-center align-items-center"
          style={{
            display: "flex",
            width: "120px",
            height: "120px",
            background: "#FFD366",
            borderRadius: "100%",
            marginLeft: "53px",
            fontSize: "24px",
            cursor: "pointer",
          }}
          ref={sumitRef}
          onClick={() => {
            calculate();
          }}
        >
          看結果
        </div>
        <div
          className=" justify-content-center align-items-center"
          style={{
            display: "none",
            color: "color",
          }}
          ref={resultRef}
        >
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "123px",
              height: "123px",
              border: "6px solid ",
              borderRadius: "100%",
              marginLeft: "53px",
              position: "relative",
              borderColor: `${getColor(BMI).color}`,
            }}
          >
            <div
              style={{
                color: `${getColor(BMI).color}`,
              }}
            >
              <div className="num">{BMI}</div>
              <div
                style={{
                  fontFamily: ".AppleSystemUIFont",
                  fontSize: " 14px",
                  textAlign: "center",
                  marginTop: "4px",
                }}
              >
                BMI
              </div>
            </div>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                border: "3px solid #424242",
                width: "30px",
                height: "30px",
                borderRadius: "100%",
                backgroundColor: `${getColor(BMI).color}`,
              }}
            >
              <img src={loop} alt="" />
            </div>
          </div>
          <div
            style={{
              fontFamily: ".SFNSDisplay",
              fontSize: "32px",
              marginLeft: "18px",
              color: `${getColor(BMI).color}`,
            }}
          >
            {getColor(BMI).word}
          </div>
        </div>
      </div>
      <div
        className="under d-grid"
        style={{
          marginBottom: "74px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginTop: "48px",
            fontFamily: ".SFNSDisplay",
            fontSize: "24px",
            marginBottom: "36px",
          }}
        >
          BMI 紀錄
        </div>
        <div
          style={{
            height: oldData.length < 5 ? "50vh" : "",
          }}
        >
          {oldData.map((data, i) => {
            return (
              <div
                key={i}
                className="d-flex justify-content-center align-items-center"
                style={{
                  marginBottom: "16px",
                }}
              >
                <div
                  className="d-flex  align-items-center"
                  style={{
                    width: "624px",
                    height: "62px",
                    background: "#FFFFFF",
                    borderLeft: `solid  7px ${getColor(data?.BMI)?.color}`,
                  }}
                >
                  <div
                    className="bigWord"
                    style={{
                      width: "110px",
                      marginLeft: "12px",
                      textWrap: "nowrap",
                    }}
                  >
                    {getColor(data?.BMI)?.word}
                  </div>
                  <div
                    className="d-flex"
                    style={{
                      width: "123px",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "7px",
                      }}
                      className="smallWord"
                    >
                      BMI
                    </div>
                    <div className="bigWord">{data?.BMI}</div>
                  </div>
                  <div
                    className="d-flex"
                    style={{
                      width: "134px",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "7px",
                      }}
                      className="smallWord"
                    >
                      weight
                    </div>
                    <div className="bigWord">{data?.weight}kg</div>
                  </div>
                  <div
                    className="d-flex"
                    style={{
                      width: "159px",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "7px",
                      }}
                      className="smallWord"
                    >
                      height
                    </div>
                    <div className="bigWord">{data?.height}cm</div>
                  </div>
                  <div
                    className="smallWord"
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {data?.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="footer d-flex justify-content-center align-items-center"
        style={{
          background: "#FFD366",
          height: "90px",
          marginTop: "58px",
        }}
      >
        <img
          src={BlackLogo}
          alt=""
          style={{
            width: "55px",
            height: "55px",
          }}
        />
      </div>
    </div>
  );
}

export default App;
