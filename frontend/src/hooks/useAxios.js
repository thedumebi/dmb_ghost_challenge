import use_axios from "axios-hooks";

const useAxios = (url, method) => {
  const [{ ...resultAxios }, resultFunction] = use_axios(
    {
      url: `${url}`,
      method,
    },
    { manual: true }
  );

  const resultCall = async (data) => {
    const result = await resultFunction(data);
    return result.data;
  };

  return {
    state: resultAxios,
    result: resultCall,
  };
};

export default useAxios;
