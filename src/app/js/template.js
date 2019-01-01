module.exports = {
  TUNNEL_ITEM: `<li class=\"list-group-item\"><div class=\"media-body\"><strong>${name}</strong><span id=\"helperText\"></span><div class=\"btn-group pull-right\"><button class=\"${tunnel.connectClassName}\" onclick=\"connect(\"${ tunnel.uuid }\")\"><span class=\"icon icon-signal\"></span></button><button class=\"btn btn-default\" onclick=\"edit(\"${tunnel.uuid}\"})\"><span class=\"icon icon-pencil\"></span></button><button class=\"btn btn-default\" onclick=\"deleteTunnel(\"${tunnel.uuid}\")\"><span class=\"icon icon-trash\"></span></button></div></div></li>`
}
