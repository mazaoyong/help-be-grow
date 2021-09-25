import React, { useState } from 'react';
import { ISearchCardProps } from '@type'
import { Box, Button, Card, Tooltip, Typography } from '@material-ui/core';

const SearchCard: React.FC<ISearchCardProps> = (props) => {
  const [isCopy, setIsCopy] = useState(false);
  const { keyword = "", searchItem = [] } = props;
  // 点击复制
  const handleSearchCardClick = (content: string[]) => {
    // const notCopyList = ["navigator", "appName"];
    // if (notCopyList.includes(keyVal)) {
    //   return;
    // }
    var aux = document.createElement("input");
    aux.setAttribute("value", content.toString());
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    setIsCopy(true);
  };

  return (
    <Card className="mb-6">
      {searchItem.map(({ title, content }, index) => {
        return (
          <Box px={2} py={1} key={index}>
            <Box>
              <Typography variant="h6" color="textPrimary">
                {title}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" color="textSecondary">
                  {content.map((item, index) => (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.replace(
                          new RegExp(keyword, "g"),
                          `<span class="user-input">${keyword}</span>`
                        ),
                      }}
                      key={index}
                    ></div>
                  ))}
                </Typography>
                <Box ml="auto">
                  <Tooltip
                    title={isCopy ? "已复制！" : "复制到剪切板"}
                    placement="top"
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        handleSearchCardClick(content)
                      }
                      onMouseOut={() => setIsCopy(false)}
                    >
                      复制
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Card>
  );
};

export default SearchCard