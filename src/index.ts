const renderPages = (pageName: string): void => {
  fetch(`pages/${pageName}.html`)
    .then((resp) => resp.text())
    .then((html) => {
      const rootElem = document.getElementById("root") as HTMLElement;
      rootElem.innerHTML = html;
    });
};
renderPages("start");
//renderPages("quiz");
//renderPages("leaderboard");


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
