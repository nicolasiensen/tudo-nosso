var Dropdown = React.createClass({
  getInitialState: function(){
    return {
      isOpened: false
    };
  },

  toggle: function(e){
    e.preventDefault();
    this.setState({isOpened: !this.state.isOpened});
  },

  render: function(){
    var dropdown;
    var dropdownOverlay;
    var currentUser = this.props.currentUser;
    console.log(currentUser);

    if(this.state.isOpened){
      dropdownOverlay =
        <div className="fixed top-0 right-0 bottom-0 left-0" onClick={this.toggle} />;
      dropdown =
        <div className="absolute right-0 mt1 nowrap rounded border">
          <a
            href="/users/edit"
            data-method='get'
            className="button block button-transparent bg-white"
            onClick={this.toggle}>
            Editar minha conta
          </a>
          <a
            href="/users/sign_out"
            data-method='delete'
            className="button block button-transparent bg-white red"
            onClick={this.toggle}>
            Sair
          </a>
        </div>;
    }

    return(
      <div className="relative inline-block">
        <a href="#" className="button button-transparent flex flex-center p1" onClick={this.toggle}>
          <img height="30" width="30" className="circle mr1" title={currentUser.name} />
          <i className="fa fa-caret-down" />
        </a>
        {dropdownOverlay}
        {dropdown}
      </div>
    );
  }
});