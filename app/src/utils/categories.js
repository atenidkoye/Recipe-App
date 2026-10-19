export const getCategories = async () => {
  const response = await fetch('http://10.0.2.2:4000/api/categories');
  const body = await response.json();

  return body;
}