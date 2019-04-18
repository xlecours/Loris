<h5>{$project['title']}</h5>
    <div class="progress">
        <div class="progress-bar progress-bar-female" role="progressbar" style="width: {$project['french_percent']}%" data-toggle="tooltip" data-placement="bottom" title="{$project['french_percent']}%">
            <p>
            {$project['french_total']}
            <br>
            French
            </p>
        </div>
        <div class="progress-bar progress-bar-male" data-toggle="tooltip" data-placement="bottom" role="progressbar" style="width: {$project['english_percent']}%"  title="{$project['english_percent']}%">
            <p>
            {$project['english_total']}
            <br>
            English
            </p>
        </div>
        <p class="pull-right small target">Target: {$project['recruitment_target']}</p>
    </div>
