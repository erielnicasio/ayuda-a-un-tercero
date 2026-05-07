(function(){
  function loadFooterCommon(){
    // Cargar el footer común y reemplazar footers existentes
    fetch('assets/footer/common.html', { cache: 'reload' })
      .then(function(res){ return res.text(); })
      .then(function(html){
        var targets = document.querySelectorAll('footer.footer, footer.site-footer');
        targets.forEach(function(el){
          el.innerHTML = html;
        });
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
          lucide.createIcons();
        }
      })
      .catch(function(err){
        console.error('Footer include failed:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooterCommon);
  } else {
    loadFooterCommon();
  }
})();
