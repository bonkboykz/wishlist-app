import axios from "axios";

// const currencyConverterApi = axios.create({
//   baseURL: "https://free.currconv.com/api/v7",
//   params: {
//     apiKey: process.env.CURRENCY_CONVERTER_API_KEY,
//   },
// });

// export const currencyConverterApiRoutes = {
//   convert: "/convert",
// };

export const getConversionRate = async (
  from: string,
  to: string
): Promise<{
  [key: string]: number;
}> => {
  // const response = await currencyConverterApi.get(currencyConverterApiRoutes.convert, {
  //   params: {
  //     q: `${from}_${to},${to}_${from}`,
  //     compact: "ultra",
  //   },
  // });

  // if (!response.data[`${from}_${to}`]) {
  //   return { [`${from}_${to}`]: 1, [`${to}_${from}`]: 1 };
  // }

  // return response.data;
  return {};
};

// export default currencyConverterApi;
