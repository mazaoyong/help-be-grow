import $ from 'zan-utils/jquery';

import { IVisBreadcrumb } from './index';
const $breadcrumb = $('#js-page-breadcrumb');

export function switchBreadcrumb(config: string | IVisBreadcrumb): void {
  if (typeof config === 'string') {
    switchBreadcrumbPage(config);
  }

  if (typeof config === 'object') {
    const $project = $breadcrumb.find('.project');
    if (typeof config.project === 'string') {
      $project.text(config.project);
    }

    if (typeof config.project === 'object') {
      if (config.project.name) {
        $project.text(config.project.name);
      }

      if (config.project.href) {
        $project.attr('data-href', config.project.href);
      } else {
        replaceTagName($project, 'span');
      }
    }

    if (config.page) {
      switchBreadcrumbPage(config.page);
    } else {
      $breadcrumb.find('.page').remove();
    }
  }
}

export function switchBreadcrumbPage(page: string): void {
  $breadcrumb.find('.page').remove();
  const $project = $breadcrumb.find('.project');
  const href = $project.data('href');

  if (page === '') {
    replaceTagName($project, 'span');
  } else {
    if (href) {
      const $newProject = replaceTagName($project, 'a');
      $newProject.attr('href', href);
    }

    const $newPageNode = $(`<span class="page">${page}</span>`);
    $breadcrumb.append($newPageNode);
  }
}

export function replaceTagName($dom, tagName) {
  $dom = $dom.get(0);
  let attrs = '';

  $.each($dom.attributes, (_, attribute) => {
    attrs += `${attribute.name}="${attribute.value}" `;
  });
  const $newDom = $(`<${tagName} ${attrs}>${$($dom).html()}</${tagName}>`);

  $($dom).replaceWith($newDom[0]);

  return $breadcrumb.find('.project');
}
