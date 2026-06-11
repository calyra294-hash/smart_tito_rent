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
          src="https://app.powerbi.com/view?r=eyJrIjoiYjQ4YjgwMDMtNmEyZi00NTgyLTljOTctM2YzYjczZmZiZjI2IiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
          allowFullScreen
        ></iframe>
      </Card>
    </Container>

    </div>

        
  );
};

export default Dashboard;