GenomicBrowserApp = React.createClass({
    getInitialState: function() {
        return {
            'activetab': 'profile'
        };
    },
    componentDidMount: function () {
        this.loadCurrentTabContent();
    },
    loadCurrentTabContent : function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                document.getElementById("demo").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", "", true);
        xhttp.send();
    },
    render: function() {
        return <h1>{this.state.activetab}</h1>;
    }
});
RGenomicBrowserApp = React.createFactory(GenomicBrowserApp);
