javascript: (function($) {
    $('head').append('<style type="text/css">.standings--datatable table { counter-reset: row-num; } .standings--datatable table tbody tr { counter-increment: row-num; } .standings--datatable table tbody tr td:first-child::before { content: counter(row-num) ". "; }</style>');
})(jQuery);