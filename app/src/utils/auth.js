export const login = async (email, password, setUser) => {
  const response = await fetch("http://10.0.2.2:4000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email: email, password: password})
  })
  
  const body = await response.json();
  if (response.ok) {
    setUser(body.data);
  } else {
    alert(body.message);
  }
}

export const register = async (name, email, password, setUser) => {
  const response = await fetch("http://10.0.2.2:4000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email: email, password: password, name: name})
  })
  
  const body = await response.json();
  if (response.ok) {
    setUser(body.data);
  } else {
    alert(body.message);
  }
}

export const logout = (setUser) => {
  setUser(null);
}