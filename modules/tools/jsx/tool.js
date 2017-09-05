class ToolTile extends React.Component
{
  constructor(props) {
    super(props);

    this.seeDetails = this.seeDetails.bind(this);
  }

  seeDetails() {
    const link = this.props.DataURL.concat(this.props.name);
    window.location.href = link;
  }

  render() {
    return (
      <div className='tool-tile' onClick={this.seeDetails}>
        <div className='tool-tile-title'> 
          {this.props.name}
        </div>
      </div>
    );
  }
}

export default ToolTile;
