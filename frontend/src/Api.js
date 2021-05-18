import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8124";

class Api {

  static async getNumberFact(val) {
    let res = await axios.get(`${BASE_URL}/${val}`);
    return res.data;
  }

  //Obj = { 42: fact about 42} <- context throughout
  //Obj.keys = 42

}

export default Api;