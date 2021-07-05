import { BrowserRouter, Route, Switch } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";

import { AdminRoom } from "./pages/AdminRoom";
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";

import "./styles/global.scss";


function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch> {/*serve para que se uma rota foi acessada ele vai parar de procurar por outras iguais */}
          <Route path="/" exact component={Home} /> {/* o exact serve para que essa rota tenha que ser escrita exatamente como está no path */}
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} /> {/*o :id é parametro que basicamente diz para o react-router-dom que quando alguém acessar /rooms/qualquerCoisa vai cair em Room*/}

          <Route path="/admin/rooms/:id/" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;