const renderPage = async (pageName: string): Promise<void> => {

    const html = await fetch(`pages/${pageName}.html`).then((resp) => resp.text());
    
    const rootElement = document.getElementById("root") as HTMLElement;

    rootElement.innerHTML = html;
  };
  