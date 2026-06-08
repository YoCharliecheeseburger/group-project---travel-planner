import React, { useState, useEffect } from "react";
import "../index.css";

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? JSON.parse(decodeURIComponent(match[2])) : null;
};

const setCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(
    JSON.stringify(value)
  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const TripBudgetCalculator = ({ budget, setBudget }) => {
  const COOKIE_KEY = "trip_budget";
  const COSTS_KEY = "trip_costs";

  const [costs, setCosts] = useState({
    hotel: 500,
    food: 350,
    transport: 400,
  });

  const [initialized, setInitialized] = useState(false);

  /* ---------------- LOAD FROM COOKIES (ONCE) ---------------- */
  useEffect(() => {
    const savedBudget = getCookie(COOKIE_KEY);
    const savedCosts = getCookie(COSTS_KEY);

    if (savedBudget !== null && savedBudget !== undefined && !isNaN(savedBudget)) {
      setBudget(Number(savedBudget));
    }

    if (savedCosts) {
      setCosts(savedCosts);
    }

    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    setCookie(COOKIE_KEY, budget);
  }, [budget, initialized]);

  useEffect(() => {
    if (!initialized) return;
    setCookie(COSTS_KEY, costs);
  }, [costs, initialized]);

  const totalSpent =
    Number(costs.hotel) + Number(costs.food) + Number(costs.transport);

  const balance = budget - totalSpent;

  const handleChange = (category, value) => {
    setCosts((prev) => ({
      ...prev,
      [category]: Number(value),
    }));
  };

  const getPercentage = (value) =>
    budget > 0 ? (value / budget) * 100 : 0;

  return (
    <div className="trip-budget-container">
      <h1 className="trip-budget-title">Trip Budget Calculator</h1>

      <div className="trip-budget-dashboard">
        <div className="trip-budget-card">
          <h3>Total Budget</h3>
          <div className="trip-budget-amount">{budget} €</div>
        </div>

        <div className="trip-budget-card trip-budget-card--spent">
          <h3>Planned Spending</h3>
          <div className="trip-budget-amount">{totalSpent} €</div>
        </div>

        <div className="trip-budget-card trip-budget-card--balance">
          <h3>Remaining</h3>
          <div
            className="trip-budget-amount"
            style={{ color: balance < 0 ? "#e74c3c" : "#2bc48a" }}
          >
            {balance} €
          </div>
        </div>
      </div>

      <div className="trip-budget-main">
        <div className="trip-budget-panel">
          <h2>Enter expenses</h2>

          <div className="trip-budget-input-group">
            <label>Maximum budget (€)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>

          <hr style={{ margin: "20px 0" }} />

          <div className="trip-budget-input-group">
            <label>🏨 Hotel</label>
            <input
              type="number"
              value={costs.hotel}
              onChange={(e) => handleChange("hotel", e.target.value)}
            />
          </div>

          <div className="trip-budget-input-group">
            <label>🍕 Food</label>
            <input
              type="number"
              value={costs.food}
              onChange={(e) => handleChange("food", e.target.value)}
            />
          </div>

          <div className="trip-budget-input-group">
            <label>🛫 Transport</label>
            <input
              type="number"
              value={costs.transport}
              onChange={(e) => handleChange("transport", e.target.value)}
            />
          </div>
        </div>

        <div className="trip-budget-panel">
          <h2>Category breakdown</h2>

          {["hotel", "food", "transport"].map((key) => (
            <div className="trip-budget-category" key={key}>
              <div className="trip-budget-category-info">
                <span>{key}</span>
                <span>{costs[key]} €</span>
              </div>

              <div className="trip-budget-progress-bar">
                <div
                  className="trip-budget-progress-fill"
                  style={{
                    width: `${Math.min(getPercentage(costs[key]), 100)}%`,
                    backgroundColor:
                      getPercentage(costs[key]) > 50 ? "#e74c3c" : "#2bc48a",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripBudgetCalculator;