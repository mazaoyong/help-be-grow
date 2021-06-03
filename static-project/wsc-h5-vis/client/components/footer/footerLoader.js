import $ from 'zepto';

export default () => {
  const footer = $('#js-footer-textarea');
  let footerHeight = 0;

  if (footer.length) {
    const value = footer.html() || '';
    const parent = footer.parent();
    footer.after(value).remove();
    footerHeight = parent.height();
  }

  // 设置容器最小高度把footer撑到底部
  const container = $('.container');
  let footerEleHeight = 0;

  $('.js-footer-ele').each(function() {
    footerEleHeight += $(this).height();
  });
  container && container.css('minHeight', $(window).height() - footerHeight - footerEleHeight);
};
