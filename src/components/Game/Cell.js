import React, { PureComponent } from  'react';
import styled from  'styled-components';

const StyledCell = styled.span`
  border-top: 1px solid grey;
  border-left: 1px solid grey;
  text-align: center;
  background: ${ props => props.alive ? 'rgb(186, 1, 35)' : 'rgb(231, 168, 244) '};
`

class Cell extends PureComponent {

  clickHandler = () => {
    this.props.onClick(this.props.x, this.props.y)
  }

  render () {
    return (
      <StyledCell alive={this.props.alive} onClick={this.clickHandler}>
      </StyledCell>
    )
  }
  
}

// const Cell = (props) => {
//   return (
//     <StyledCell alive={props.alive} onClick={props.onClick}>
//     </StyledCell>
//   )
// }

export default Cell;

