import { Container, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div className="contenido-principal">

            <div className="contenedor-dashboard"></div>
    <Container>
      <br />
      <Card style={{ height: 600 }}>
        <iframe
          title="estaditicas"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiYjVkYmNiNDEtZDk0Ny00NTAwLTlmOGMtMTc5NzM5OTNiOWE5IiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
          allowFullScreen
        ></iframe>
      </Card>
    </Container>

    </div>

        
  );
};

export default Dashboard;