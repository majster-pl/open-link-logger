import moment from "moment";

const HeaderDate = ({ daysSelected }) => {
  if (daysSelected === 0) {
    return (
      <div>
        <h1>Displaying all collected data</h1>
        <h4>
          <span style={{ color: "transparent" }}>today</span>
        </h4>
      </div>
    );
  } else {
    let days_text = daysSelected === 1 ? "hours" : "days";

    return (
      <div>
        <h1>
          Last {daysSelected === 1 ? 24 : daysSelected} {days_text}
        </h1>
        <h4>
          {daysSelected !== 1 ? (
            <>
              <span className="fw-light">From: </span>{" "}
              {moment()
                .days(-daysSelected + 1)
                .format("DD MMM YYYY")}{" "}
              <span className="fw-light">To: </span>
              {moment().format("DD MMM YYYY")}
            </>
          ) : (
            <>
              <span style={{ color: "transparent" }}>today</span>
            </>
          )}
        </h4>
      </div>
    );
  }
};

export default HeaderDate;
