import React, { useCallback, useMemo } from 'react';
import { hashHistory } from 'react-router';
import { VerticalTabs } from 'zent';
import { checkAccess } from '@youzan/sam-components';

export default function Aside({ menus }) {
  const _menus = useMemo(() => {
    return menus.map((menu: any) => {
      if (menu.divide) {
        return menu;
      }
      const key = menu.hash ? menu.path + '#' + menu.hash : menu.path;
      const disabled = (menu.samName && !checkAccess(menu.samName)) || false;
      return {
        title: menu.title,
        key,
        disabled,
      };
    });
  }, [menus]);

  const activeId = useMemo(() => {
    const path = window.location.pathname;
    const { pathname: hash } = hashHistory.getCurrentLocation();
    return searchPath(menus, path, hash);
  }, [menus]);

  const handleTabChange = useCallback(id => {
    window.location.href = id;
  }, []);

  return (
    <div className="edu-plugin-framework-aside">
      <VerticalTabs
        activeId={activeId}
        onChange={handleTabChange}
        tabs={_menus}
      />
    </div>
  );
}

function searchPath(menus: any[], path = '', hash = '') {
  const menus1 = menus.filter(menu => menu.path === path);
  const menus2 = menus1.filter(menu => menu.hash === hash);
  if (menus2.length > 0) {
    const curMenu = menus2[0];
    return curMenu.path + '#' + curMenu.hash;
  }
  if (menus1.length > 0) {
    const curMenu = menus1[0];
    return curMenu.path;
  }
  return path + '#' + hash;
}
