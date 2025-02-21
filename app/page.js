import Example from "./(homecomponents)/navbar"; 
import Hero from "./(homecomponents)/hero";
import Feautres from "./(homecomponents)/feature"
import BenefitSection from "./(homecomponents)/Benifits"
import Pricing from "./(homecomponents)/pricing"
import Footer from "./(homecomponents)/footer"
export default function Home() {

  return (
    <>
      <Example />
      <br></br>
      <Hero></Hero>
      <Feautres></Feautres>
      <BenefitSection></BenefitSection>
      <Pricing></Pricing>
      <Footer></Footer>
    </>
  );
}
