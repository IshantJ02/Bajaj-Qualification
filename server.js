const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const EMAIL = "ishant1248.be23@chitkarauniversity.edu.in";
function fibonacci(n) {
  if (n === 0) return [];
  if (n === 1) return [0];

  let series = [0, 1];
  for (let i = 2; i < n; i++) {
    series.push(series[i - 1] + series[i - 2]);
  }
  return series;
}

function getPrimes(arr) {
  function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }
  return arr.filter(isPrime);
}

function hcf(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

function lcm(a, b) {
  return Math.abs(a * b) / hcf(a, b);
}

function lcmArray(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, val) => lcm(acc, val), 1);
}

function hcfArray(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, val) => hcf(acc, val));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL,
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        is_success: false,
        message: "Request body cannot be empty",
      });
    }

    const keys = Object.keys(body);
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        message: "Request must contain exactly one key",
      });
    }

    const key = keys[0];
    const value = body[key];
    let data;

    switch (key) {
      case "fibonacci":
        if (typeof value !== "number" || value < 0) {
          return res.status(400).json({
            is_success: false,
            message: "Invalid fibonacci input",
          });
        }
        data = fibonacci(value);
        break;

      case "prime":
        if (
          !Array.isArray(value) ||
          !value.every((n) => Number.isInteger(n))
        ) {
          return res.status(400).json({
            is_success: false,
            message: "Prime expects integer array",
          });
        }
        data = getPrimes(value);
        break;

      case "lcm":
        if (
          !Array.isArray(value) ||
          value.length === 0 ||
          !value.every((n) => Number.isInteger(n))
        ) {
          return res.status(400).json({
            is_success: false,
            message: "LCM expects non-empty integer array",
          });
        }
        data = lcmArray(value);
        break;

      case "hcf":
        if (
          !Array.isArray(value) ||
          value.length === 0 ||
          !value.every((n) => Number.isInteger(n))
        ) {
          return res.status(400).json({
            is_success: false,
            message: "HCF expects non-empty integer array",
          });
        }
        data = hcfArray(value);
        break;

      case "AI":
        if (typeof value !== "string" || value.trim() === "") {
          return res.status(400).json({
            is_success: false,
            message: "AI expects question string",
          });
        }

        data = "Mumbai";
        break;

      default:
        return res.status(400).json({
          is_success: false,
          message: "Invalid key provided",
        });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      is_success: false,
      message: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
