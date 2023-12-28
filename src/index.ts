
const saveData = (): void => {
  const inputUser = document.getElementById("#input-name") as HTMLInputElement;
  const playerName = inputUser.value; 

  if (playerName.trim() !== '') {
    localStorage.setItem('playerName', playerName); 

    alert('bem vindo, ${playerName}!'); 
  } else {
    alert('Inserir nome!'); 
  }

};
saveData(); 

