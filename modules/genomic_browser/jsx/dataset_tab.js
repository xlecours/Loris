var DatasetTab = React.createClass({
  getDefaultProps: function () {
    return {
      variableType: null,
      candidateList: []
    };
  },
  getInitialState: function() {
    return {
        datasets: []
    };
  },
  componentDidMount: function() {
    var newState = {};

    var that = this;
    var xhttp = new XMLHttpRequest();

    // Get variable_type to create tab labels
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var response = JSON.parse(xhttp.responseText);
          newState['datasets'] = response;
        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(
            xhttp.statusText
          );
        }
      }
      newState['queryString'] = QueryString;
      that.setState(newState);
    };
    var url = loris.BaseURL.concat(
      '/genomic_browser/ajax/get_datasets.php'
    );
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  render: function() {
    var datasets = this.state.datasets.map(function(d) {
        var name = ''.concat( d.value.loris_file_id, " : ", d.value.file_name.substr( d.value.file_name.lastIndexOf('/')+1));
        return <Dataset data={d.value} />
              
    },this);

    return <div>{datasets}</div>;
  }
});

var Dataset = React.createClass({
  getInitialState: function() {
    return { 'collapsed' : true }
  },
  toggleCollapsed: function() {
    this.setState({ 'collapsed' : !this.state.collapsed });
  },
  render: function() {
    var name = this.props.data.file_name;
    var targetName = '#'.concat(this.props.data._id);

    // Change arrow direction when closed
    var glyphClass = this.state.collapsed ? "glyphicon pull-right glyphicon-chevron-down" : "glyphicon pull-right glyphicon-chevron-up";

    var sample_list = [];
    console.log(this.props.data);
    var annotation_list = [];
    var infos = [];

    return <div className="panel panel-primary">
             <div className="panel-heading"
               onClick={this.toggleCollapsed}
               data-toggle="collapse"
               data-target={targetName}
             >
               {name}
               <span className={glyphClass}></span>
             </div>
             <div id={this.props.data._id} className="panel-collapse collapse" role="tabpanel">
               <div className="panel-body">
                 <div className="col-md-12">

                   <div className="row">
                     <div className="panel panel-primary">
                       <div className="panel-heading"
                         onClick={this.toggleCollapsed}
                         data-toggle="collapse"
                         data-target={targetName + '_infos'}
                       >
                         Samples
                         <span className="glyphClass"></span>
                       </div>
                       <div id={this.props.data._id + '_infos'} className="panel-collapse collapse" role="tabpanel">
                         <div className="panel-body">
                           <div className="row">
                             <div className="col-md-12">
                               {infos}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div> 
  
                   <div className="row">
                     <div className="panel panel-primary">
                       <div className="panel-heading"
                         onClick={this.toggleCollapsed}
                         data-toggle="collapse"
                         data-target={targetName + '_samples'}
                       >
                         Samples
                         <span className="glyphClass"></span>
                       </div>
                       <div id={this.props.data._id + '_samples'} className="panel-collapse collapse" role="tabpanel">
                         <div className="panel-body">
                           <div className="row">
                             <div className="col-md-12">
                               {sample_list}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
  
                   <div className="row">
                     <div className="panel panel-primary">
                       <div className="panel-heading"
                         onClick={this.toggleCollapsed}
                         data-toggle="collapse"
                         data-target={targetName + '_annotations'}
                       >
                         Annotations
                         <span className="glyphClass"></span>
                       </div>
                       <div id={this.props.data._id + '_annotations'} className="panel-collapse collapse" role="tabpanel">
                         <div className="panel-body">
                           <div className="row">
                             <div className="col-md-12">
                               {annotation_list}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                 </div>
               </div>
             </div>
           </div>
  }
});
