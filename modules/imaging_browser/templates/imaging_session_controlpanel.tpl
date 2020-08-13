    <h3>Navigation</h3>
    <ul>
        {if $subject.backURL}
            <li><a href="{$subject.backURL}">
                    <span class="text-default">
                        <span class="glyphicon glyphicon-backward"></span>&nbsp;Back to list
                    </span>
                </a>
             </li>
        {/if}
        {if $subject.prevTimepoint.URL != ''}
            <li>
                <a href="{$subject.prevTimepoint.URL}">
                   <span class="text-default">
                       <span class="glyphicon glyphicon-step-backward"></span>&nbsp;Previous
                   </span>
                 </a>
            {/if}
       	    {if $subject.nextTimepoint.URL != ''}
                <a href="{$subject.nextTimepoint.URL}">
                  <span class="text-default">
                      &nbsp;&nbsp;Next&nbsp;<span class="glyphicon glyphicon-step-forward"></span>
                  </span>
                </a>
           </li>
        {/if}
    </ul>
    {if $prevTimepoint.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}
    <h3>Volume Viewer</h3>
       <input id="bbonly" type="button" class="btn btn-volume-viewer" accesskey="d" value="3D Only">
       <input id="bboverlay" type="button" class="btn btn-volume-viewer" accesskey="c" value="3D + Overlay">
