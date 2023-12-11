
const renderPages = (pageName: string): void => {
    fetch(`pages/${pageName}.html`)
      .then((resp) => resp.text())
      .then((html) => {
        const rootElem = document.getElementById("root") as HTMLElement;
        rootElem.innerHTML = html;
      });
}
renderPages("start"); 
renderPages("quiz");
renderPages("leaderboard"); 