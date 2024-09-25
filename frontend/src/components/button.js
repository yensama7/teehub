import styled from "styled-components";

// this is a file for buttons of the site

export const ButtonContainer = styled.button`
text-transform: capitalize;
font-size: 1.4rem;
background: transparent;
border: 0.05rem solid var(--mainblue);
color:var(--maindark);
border-radius:0.5rem;
padding: 0.2rem 0.5rem;
cursor:pointer;
margin: 0.2rem 0.5rem 0.2rem 0;
transition:all 0.5s ease-in-out;
&:hover{
background: var(--darkbrown);
color:var(--maindark);
}
&:focus{
outline: none;
}
`;

